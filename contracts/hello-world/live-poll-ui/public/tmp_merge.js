const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, 'template.html');
const newUiPath = path.join(__dirname, 'tmp_new_ui.html');

try {
  const oldContent = fs.readFileSync(templatePath, 'utf8');
  const scriptStart = oldContent.indexOf('<script>');
  if (scriptStart === -1) {
    console.error("Error: Could not find <script> in original template.html");
    process.exit(1);
  }

  const jsContent = oldContent.substring(scriptStart + 8, oldContent.lastIndexOf('</script>'));
  const newHtml = fs.readFileSync(newUiPath, 'utf8');

  const combined = newHtml + jsContent + "\n</script>\n</body>\n</html>\n";

  fs.writeFileSync(templatePath, combined, 'utf8');
  console.log("Successfully merged and updated template.html");
  
  fs.unlinkSync(newUiPath);
} catch (err) {
  console.error("Error:", err);
  process.exit(1);
}
