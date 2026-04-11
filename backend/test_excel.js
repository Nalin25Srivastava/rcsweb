const mongoose = require('mongoose');
const XLSX = require('xlsx');
const PlacedStudent = require('./models/PlacedStudent');
const { syncPlacedStudentsExcelToDB } = require('./utils/excelSync');
const path = require('path');

async function test() {
    await mongoose.connect('mongodb://localhost:27017/rcsweb_test');

    await PlacedStudent.deleteMany({});
    
    // Create an initial student
    let student = await PlacedStudent.create({
        name: 'John Doe',
        company: 'Acme Corp',
        position: 'Developer',
        image: 'http://example.com/image.jpg',
        placedDate: new Date('2023-01-01')
    });

    console.log('Created student:', student);

    // Create an excel file mimicking placed_students.xlsx
    const filePath = path.join(__dirname, 'test_placed_students.xlsx');
    const data = [
        {
            'Name': 'John Doe',
            'Company': 'Acme Corp',
            'Position': 'Senior Developer', // Changed
            'Image': 'http://example.com/image2.jpg', // Changed
            'Placed Date': '02/01/2023', // Changed Date
        }
    ];
    
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Placed Students');
    XLSX.writeFile(workbook, filePath);

    // Trigger sync
    await syncPlacedStudentsExcelToDB(filePath);

    // Check DB changes
    const updated = await PlacedStudent.findOne({ name: 'John Doe', company: 'Acme Corp' });
    console.log('Updated student in DB:', updated);

    await mongoose.disconnect();
}

test().catch(console.error);

// test