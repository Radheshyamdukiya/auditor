const express = require('express');
const router = express.Router();
const Url = require('../models/data.model');
const ExcelJS = require('exceljs');

router.get('/download-users', async (req, res) => {
    try {
        // 1. Database se data lao
        const data = await Url.find().lean();

        if (!data || data.length === 0) {
            return res.status(404).json({ ok: false, message: "No data to export" });
        }

        // 2. Excel Workbook setup
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('All Users Data');

        // 3. Columns define karo (Tere schema ke hisab se)
        worksheet.columns = [
            { header: 'Name', key: 'name', width: 20 },
            { header: 'Title', key: 'title', width: 25 },
            { header: 'URLs (Links)', key: 'formattedUrls', width: 50 },
            { header: 'Created Date', key: 'createdAt', width: 20 },
        ];

        // 4. Data ko format karke rows add karo
        data.forEach((item) => {
            worksheet.addRow({
                name: item.name,
                title: item.title,
                // urls array ko "link1, link2" format mein badal rahe hain
                formattedUrls: item.urls ? item.urls.join(', ') : '',
                createdAt: item.createdAt ? item.createdAt.toLocaleString() : ''
            });
        });

        // Styling: Pehli row (Header) ko bold kar dete hain
        worksheet.getRow(1).font = { bold: true };

        // 5. Response Headers for Excel
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=Users_Data.xlsx'
        );

        // 6. File bhej do
        await workbook.xlsx.write(res);
        res.end();

    } catch (err) {
        console.error("Excel Export Error:", err);
        res.status(500).json({ ok: false, message: "Download failed" });
    }
});

module.exports = router;