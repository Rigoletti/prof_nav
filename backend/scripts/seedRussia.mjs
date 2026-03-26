/**
 * Загрузка колледжей и специальностей РФ из backend/data/russiaSeed.mjs.
 * Идемпотентно: повторный запуск обновляет записи по коду специальности и имени+городу колледжа.
 *
 * Запуск: npm run seed:russia (из папки backend, нужен MONGODB_URI в .env)
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import mongoose from 'mongoose';
import connectDB from '../config/db.mjs';
import College from '../models/College.mjs';
import Specialty from '../models/Specialty.mjs';
import { RUSSIAN_COLLEGES, RUSSIAN_SPECIALTIES } from '../data/russiaSeed.mjs';

async function upsertColleges() {
    const byKey = new Map();
    for (const c of RUSSIAN_COLLEGES) {
        const key = `${c.name}|${c.city}`;
        let doc = await College.findOne({ name: c.name, city: c.city });
        if (!doc) {
            doc = new College({
                name: c.name,
                city: c.city,
                region: c.region,
                address: c.address,
                description: `Образовательная организация СПО: ${c.name}`
            });
            await doc.save();
            console.log(`+ колледж: ${c.name} (${c.city})`);
        } else {
            let changed = false;
            if (c.region && doc.region !== c.region) {
                doc.region = c.region;
                changed = true;
            }
            if (c.address && doc.address !== c.address) {
                doc.address = c.address;
                changed = true;
            }
            if (changed) await doc.save();
        }
        byKey.set(key, doc);
    }
    return byKey;
}

function resolveCollegeRefs(indices, collegeByKey) {
    const ids = [];
    const names = [];
    const cities = [];
    for (const idx of indices) {
        const c = RUSSIAN_COLLEGES[idx];
        if (!c) continue;
        const key = `${c.name}|${c.city}`;
        const doc = collegeByKey.get(key);
        if (doc) {
            ids.push(doc._id);
            names.push(doc.name);
            cities.push(doc.city);
        }
    }
    return { ids, names, cities };
}

async function syncCollegeLinksForSpecialty(before, after) {
    const oldIds = before?.colleges?.map((id) => id.toString()) || [];
    const newIds = after.colleges?.map((id) => id.toString()) || [];
    const sid = after._id;

    const toRemove = oldIds.filter((id) => !newIds.includes(id));
    const toAdd = newIds.filter((id) => !oldIds.includes(id));

    if (toRemove.length) {
        await College.updateMany(
            { _id: { $in: toRemove } },
            { $pull: { specialties: sid } }
        );
    }
    if (toAdd.length) {
        await College.updateMany(
            { _id: { $in: toAdd } },
            { $addToSet: { specialties: sid } }
        );
    }
}

async function upsertSpecialties(collegeByKey) {
    for (const row of RUSSIAN_SPECIALTIES) {
        const { colleges: idxList, ...rest } = row;
        const { ids, names, cities } = resolveCollegeRefs(idxList, collegeByKey);

        const payload = {
            code: rest.code,
            name: rest.name,
            description: rest.description || '',
            educationLevel: 'SPO',
            klimovTypes: rest.klimovTypes || [],
            disciplines: rest.disciplines || [],
            duration: rest.duration,
            form: rest.form || 'full-time',
            fundingType: rest.fundingType || 'both',
            colleges: ids,
            collegeNames: names,
            collegeCities: cities,
            requirements: rest.requirements || [],
            prospects: rest.prospects || [],
            url: rest.url || ''
        };

        const before = await Specialty.findOne({ code: payload.code }).lean();
        const after = await Specialty.findOneAndUpdate(
            { code: payload.code },
            { $set: payload },
            { upsert: true, new: true, runValidators: true }
        );

        if (before) {
            await syncCollegeLinksForSpecialty(before, after);
        } else if (after.colleges?.length) {
            await College.updateMany(
                { _id: { $in: after.colleges } },
                { $addToSet: { specialties: after._id } }
            );
        }

        console.log(`• специальность: ${payload.code} — ${payload.name}`);
    }
}

async function main() {
    await connectDB();
    console.log('Засев колледжей и специальностей РФ...');
    const collegeByKey = await upsertColleges();
    await upsertSpecialties(collegeByKey);
    console.log('Готово.');
    await mongoose.disconnect();
}

main().catch(async (e) => {
    console.error(e);
    await mongoose.disconnect();
    process.exit(1);
});
