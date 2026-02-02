const express = require('express');
const router = express.Router();
const Url = require('../models/data.model');
const student_feedback = require("../models/student_feedback");
const ExcelJS = require('exceljs');
const { verfy_user } = require('../middleware/user.auth');

router.get('/download-users', verfy_user, async (req, res) => {
    try {
        const { city, date } = req.query;
        let query = {};

        // 1. Check if both are empty
        if ((!city || !city.trim()) && (!date || !date.trim())) {
            return res.status(400).json({ ok: false, message: "Please provide at least City or Date" });
        }

        // 2. Add City to Query if present
        if (city && city.trim()) {
            query.City = { $regex: new RegExp(`^${city}$`, 'i') };
        }

        // 3. Add Date to Query if present
        if (date && date.trim()) {
            const parts = date.split('/');
            if (parts.length === 3) {
                const day = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10);
                const year = parseInt(parts[2], 10);

                const s = new Date(year, month - 1, day, 0, 0, 0);
                const e = new Date(year, month - 1, day, 23, 59, 59);

                if (!isNaN(s.getTime())) {
                    query.Date = { $gte: s, $lte: e };
                }
            }
        }

        const urlData = await Url.find(query).lean();

        if (!urlData || urlData.length === 0) {
            return res.status(404).json({ ok: false, message: "No data found" });
        }

        const auditorNames = urlData.map(u => u.name);

        const feedbackData = await student_feedback.find({
            auditer_name: { $in: auditorNames }
        }).lean();

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Merged Data');

        worksheet.columns = [
            { header: 'Auditor Name', key: 'auditor', width: 20 },
            { header: 'City', key: 'city', width: 15 },
            { header: 'Exam Title', key: 'title', width: 20 },
            { header: 'Student Name', key: 'student', width: 20 },
            { header: 'Reg No', key: 'reg', width: 15 },
            { header: 'Mobile', key: 'mobile', width: 15 },
            { header: 'Suggestion', key: 'suggestion', width: 25 },
            { header: 'Feedback Ratings', key: 'ratings', width: 40 },
            { header: 'URLs', key: 'urls', width: 40 },
            { header: 'Created At', key: 'created', width: 20 }
        ];

        urlData.forEach((uItem) => {
            const matches = feedbackData.filter(f => f.auditer_name === uItem.name);

            if (matches.length > 0) {
                matches.forEach(fItem => {
                    const ratingStr = fItem.feedback 
                        ? fItem.feedback.map(r => `${r.title}: ${r.rating}`).join(', ') 
                        : '';

                    worksheet.addRow({
                        auditor: uItem.name,
                        city: uItem.City,
                        title: uItem.title,
                        student: fItem.Student_Name,
                        reg: fItem.Reg_No,
                        mobile: fItem.Mobile_No,
                        suggestion: fItem.Suggestion,
                        ratings: ratingStr,
                        urls: uItem.urls ? uItem.urls.join(', ') : '',
                        created: uItem.createdAt ? uItem.createdAt.toLocaleString() : ''
                    });
                });
            } else {
                worksheet.addRow({
                    auditor: uItem.name,
                    city: uItem.City,
                    title: uItem.title,
                    student: 'N/A',
                    reg: '-',
                    mobile: '-',
                    suggestion: '-',
                    ratings: '-',
                    urls: uItem.urls ? uItem.urls.join(', ') : '',
                    created: uItem.createdAt ? uItem.createdAt.toLocaleString() : ''
                });
            }
        });

        worksheet.getRow(1).font = { bold: true };

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Merged_Feedback_Data.xlsx');

        await workbook.xlsx.write(res);
        res.end();

    } catch (err) {
        console.error("Export Error:", err);
        res.status(500).json({ ok: false, message: "Server Error" });
    }
});

module.exports = router;