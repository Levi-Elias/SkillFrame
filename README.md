# Web Developer CV Builder

A modern, customizable CV/Resume builder specifically designed for web developers. Create professional CVs with custom colors, fonts, and layouts.

## Features

### 🎨 Customization Options
- **Color Themes**: Choose primary and accent colors for your CV
- **Font Styles**: Modern (Sans-serif), Classic (Serif), or Tech (Monospace)
- **Layout Options**: Clean & Minimal, Modern with Sidebar, or Creative & Bold

### 📝 Comprehensive Sections
- **Personal Information**: Name, title, age, contact details, and professional summary
- **Links & Portfolio**: Portfolio website, GitHub, and LinkedIn URLs
- **Work Experience**: Multiple job entries with company, position, dates, and descriptions
- **Projects**: Showcase your projects with URLs, technologies used, and descriptions
- **Technical Skills**: Programming languages, frameworks, tools, and other skills
- **Education**: Academic background and certifications

### 💾 Additional Features
- **Live Preview**: See your CV update in real-time as you fill the form
- **PDF Download**: Export your CV as a PDF file
- **HTML Export**: Export your CV as a standalone HTML file with embedded CSS
- **Test Data**: Quick-fill the form with sample data for testing (🚀 Fill with Test Data button)
- **Auto-fill**: Import your data from a text format using the import section
- **Auto-save**: Form data automatically saves to localStorage
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## How to Use

1. **Open the Application**
   - Simply open `index.html` in your web browser
   - Or host it on a local server using MAMP/XAMPP/etc.

2. **Quick Test (Optional)**
   - Click the "🚀 Fill with Test Data" button to instantly populate the form with sample data
   - This is perfect for testing the application without manual data entry
   - You can modify the test data to suit your needs

3. **Fill in Your Information**
   - Start with personal information (name and title are required)
   - Add your work experience, projects, skills, and education
   - Use the "+" buttons to add multiple entries for work, projects, or education
   - Or use the import section to paste and auto-fill your data

4. **Customize Your CV**
   - Choose your preferred colors using the color pickers
   - Select a font style that matches your personality
   - Pick a layout that best showcases your information

5. **Generate and Export**
   - Click "Generate CV" to see the preview
   - Make any adjustments needed
   - Click "Download as PDF" to save your CV as a PDF file
   - Click "📄 Export as HTML" to save as a standalone HTML file

## Project Structure

```
ai_week/
├── index.html      # Main HTML file with the form and preview
├── styles.css      # All styling and responsive design
├── script.js       # JavaScript for form handling and CV generation
└── README.md       # This file
```

## Technologies Used

- **HTML5**: Semantic markup and form elements
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript**: Vanilla JS for dynamic functionality
- **html2pdf.js**: Library for PDF generation

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Tips for Best Results

1. **Complete Profile**: Fill in as much information as possible for a comprehensive CV
2. **Project URLs**: Include links to your live projects or GitHub repos
3. **Skills Organization**: Separate skills with commas for better formatting
4. **Color Selection**: Choose colors that are professional yet reflect your style
5. **Preview Before Download**: Always check the preview before downloading the PDF

## Local Storage

The form automatically saves your data to browser's localStorage. Your information will persist even if you close and reopen the browser. To clear saved data, you can clear your browser's localStorage.

## Customization

You can further customize the CV builder by modifying:
- `styles.css`: Change default styles, add new themes
- `script.js`: Add new fields or modify CV generation logic
- `index.html`: Add new form sections or modify existing ones

## License

This project is open source and available for personal and commercial use.

## Support

For web developers looking to create a professional CV quickly and easily, this tool provides all the necessary features with a focus on customization and ease of use.
