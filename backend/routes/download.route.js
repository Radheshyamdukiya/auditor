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

        if ((!city || !city.trim()) && (!date || !date.trim())) {
            return res.status(400).json({ ok: false, message: "Please provide at least City or Date" });
        }

        if (city && city.trim()) {
            query.City = { $regex: new RegExp(`^${city}$`, 'i') };
        }

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


        
        const groupedMap = new Map();

        urlData.forEach((u) => {
            if (!groupedMap.has(u.name)) {
                groupedMap.set(u.name, {
                    city: u.City,
                    createdAt: u.createdAt,
                    tasks: [],      
                    feedbacks: []   
                });
            }
            
            const entry = groupedMap.get(u.name);
       
            entry.tasks.push({
                title: u.title,
                subtitle: u.Sub_title, 
                url: u.urls ? (Array.isArray(u.urls) ? u.urls.join(', ') : u.urls) : ''
            });
        });

        feedbackData.forEach((f) => {
            if (groupedMap.has(f.auditer_name)) {
                groupedMap.get(f.auditer_name).feedbacks.push(f);
            }
        });


       
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Merged Data');

        worksheet.columns = [
            { header: 'Auditor Name', key: 'auditor', width: 20 },
            { header: 'City', key: 'city', width: 15 },
            
            
            { header: 'Exam Title', key: 'title', width: 25 },
            { header: 'Sub Title', key: 'subtitle', width: 20 }, // <--- NEW COLUMN
            { header: 'URL', key: 'url', width: 40 },
            
            { header: 'Student Name', key: 'student', width: 20 },
            { header: 'Reg No', key: 'reg', width: 15 },
            { header: 'Mobile', key: 'mobile', width: 15 },
            { header: 'Suggestion', key: 'suggestion', width: 25 },
            { header: 'Feedback Ratings', key: 'ratings', width: 40 },
            { header: 'Created At', key: 'created', width: 20 }
        ];

       
        groupedMap.forEach((data, auditorName) => {
            const tasks = data.tasks;
            const feedbacks = data.feedbacks;

            const maxRows = Math.max(tasks.length, feedbacks.length);

            for (let i = 0; i < maxRows; i++) {
                
                const isFirstRow = (i === 0);

                
                const taskObj = tasks[i] || {}; 
                const titleVal = taskObj.title || '';
                const subtitleVal = taskObj.subtitle || ''; 
                const urlVal = taskObj.url || '';

                const fItem = feedbacks[i];
                let studentVal = '', regVal = '', mobileVal = '', suggVal = '', ratingStr = '';

                if (fItem) {
                    studentVal = fItem.Student_Name;
                    regVal = fItem.Reg_No;
                    mobileVal = fItem.Mobile_No;
                    suggVal = fItem.Suggestion;
                    ratingStr = fItem.feedback 
                        ? fItem.feedback.map(r => `${r.title}: ${r.rating}`).join(', ') 
                        : '';
                }

                worksheet.addRow({
                    auditor: isFirstRow ? auditorName : '',
                    city: isFirstRow ? data.city : '',
                    
                    title: titleVal,
                    subtitle: subtitleVal, // <--- Put Value in Row
                    url: urlVal,
                    
                    student: studentVal,
                    reg: regVal,
                    mobile: mobileVal,
                    suggestion: suggVal,
                    ratings: ratingStr,
                    
                    created: isFirstRow ? (data.createdAt ? data.createdAt.toLocaleString() : '') : ''
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