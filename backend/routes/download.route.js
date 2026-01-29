const express = require('express');
const router = express.Router();
const Url = require('../models/data.model');
const ExcelJS = require('exceljs');
const {verfy_user}=require('../middleware/user.auth');
router.get('/download-users',verfy_user, async (req, res) => {
    try {
       
        const data = await Url.find().lean();
        

        if (!data || data.length === 0) {
            return res.status(404).json({ ok: false, message: "No data to export" });
        }
       
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('All Users Data');

       
        worksheet.columns = [
            { header: 'Name', key: 'name', width: 20 },
            { header: 'Title', key: 'title', width: 25 },
            { header: 'URLs (Links)', key: 'formattedUrls', width: 50 },
            { header: 'Created Date', key: 'createdAt', width: 20 },
        ];

        
        data.forEach((item) => {
            worksheet.addRow({
                name: item.name,
                title: item.title,
             
                formattedUrls: item.urls ? item.urls.join(', ') : '',
                createdAt: item.createdAt ? item.createdAt.toLocaleString() : ''
            });
        });

    
        worksheet.getRow(1).font = { bold: true };
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=Users_Data.xlsx'
        );

        await workbook.xlsx.write(res);
        res.end();

    } catch (err) {
        console.error("Excel Export Error:", err);
        res.status(500).json({ ok: false, message: "Download failed" });
    }
});

module.exports = router;