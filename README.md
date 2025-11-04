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








// backend.js
const http = require("http");
const url = require("url");
const fetch = require("node-fetch");
require("dotenv").config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/callback";

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  if (parsed.pathname === "/callback" && parsed.query.code) {
    const code = parsed.query.code;
    // exchange code for token
    const tokenResp = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    });
    const tokenData = await tokenResp.json();
    const accessToken = tokenData.access_token;

    // get profile info
    const profileResp = await fetch(
      "https://api.linkedin.com/v2/me?projection=(localizedFirstName,localizedLastName,profilePicture(displayImage~:playableStreams))",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const profileData = await profileResp.json();

    res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
    res.end(JSON.stringify(profileData));
    return;
  }

  // Anything else 
  res.writeHead(404);
  res.end("Not found");
});

server.listen(3000, () => console.log("Backend listening on http://localhost:3000"));




index aanpassing:

<button id="linkedinImport">Importeer foto & profiel van LinkedIn</button>

<script>
  document.getElementById("linkedinImport").addEventListener("click", () => {
    const clientId = "JOUW_CLIENT_ID";
    const redirectUri = encodeURIComponent("http://localhost:3000/callback");
    const scope = encodeURIComponent("r_liteprofile");
    location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  });

  // na callback: frontend ophalen  
  if (location.pathname === "/callback") {
    fetch(`/callback${location.search}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        // verwerk: bijvoorbeeld
        const name = `${data.localizedFirstName} ${data.localizedLastName}`;
        // foto URL:
        const imgUrl = data.profilePicture["displayImage~"].elements[0].identifiers[0].identifier;
        document.getElementById("nameField").value = name;
        document.getElementById("photoPreview").src = imgUrl;
      })
      .catch(err => console.error(err));
  }
</script>
