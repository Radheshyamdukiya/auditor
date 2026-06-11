const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const CityCentre = require("../models/city_list")
const router = express.Router();
const upload = multer({ dest: 'uploads/' });
router.post('/upload-city-list', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ ok: false, message: "No file uploaded" });
        }

        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        const formattedData = sheetData.map(row => ({
            Zone: row['Zone'] || '',
            Status: row['Status'] || '',
            City: row['City'] || '',
            CentreName: row['Centre Name'] || '',
            CentreAddress: row['Centre Address'] || '',
            CentreLandmark: row['Centre Landmark'] || '',
            Pincode: String(row['Pincode'] || ''),
            CenterCode: String(row['CenterCode'] || '') 
        }));

        await CityCentre.insertMany(formattedData);

        fs.unlinkSync(req.file.path);

        res.status(200).json({ ok: true, message: "City list uploaded successfully" });

    } catch (error) {
        console.error("Upload error:", error);
        
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ ok: false, message: "Server error during upload" });
    }
});
router.get('/download-city-list', async (req, res) => {
    try {
        // 1. DB se saara data fetch kar
        const centres = await CityCentre.find({}).lean(); // lean() se pure JS objects milte hain, DB queries fast hoti hain

        if (centres.length === 0) {
            return res.status(404).json({ message: "No data found" });
        }

        // 2. Data ko sheet ke format me map kar
        const excelData = centres.map(doc => ({
            Zone: doc.Zone || '',
            Status: doc.Status || '',
            City: doc.City || '',
            'Centre Name': doc.CentreName || '',
            'Centre Address': doc.CentreAddress || '',
            'Centre Landmark': doc.CentreLandmark || '',
            Pincode: doc.Pincode || '',
            CenterCode: doc.CenterCode || ''
        }));

        // 3. Excel workbook create karke buffer me convert kar
        const worksheet = xlsx.utils.json_to_sheet(excelData);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, "City Centres");
        
        const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        // 4. Headers set kar aur file send kar de
        res.setHeader('Content-Disposition', 'attachment; filename="City_Centres.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.status(200).send(buffer);

    } catch (error) {
        console.error("Download error:", error);
        res.status(500).json({ ok: false, message: "Error downloading data" });
    }
});

module.exports = router;