const express = require('express');
const xssFilters = require('xss-filters');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

// Function to validate input against XSS and SQL injection
function validateInput(input) {
    // XSS validation
    const sanitizedInput = xssFilters.inHTMLData(input);
    if (sanitizedInput !== input) {
        return { isValid: false, type: 'xss' };
    }

    // Simple SQL injection validation (could be extended for more complex checks)
    const sqlInjectionPattern = /(\b(SELECT|UPDATE|DELETE|INSERT|DROP|ALTER|CREATE|RENAME|TRUNCATE|EXEC|UNION|ALL|DISTINCT|WHERE|AND|OR)\b)/i;
    if (sqlInjectionPattern.test(input)) {
        return { isValid: false, type: 'sql' };
    }

    return { isValid: true };
}

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Search App</title>
        </head>
        <body>
            <h1>Welcome to the Search App</h1>
            <form action="/search" method="POST">
                <label for="searchTerm">Enter Search Term:</label>
                <input type="text" id="searchTerm" name="searchTerm" required>
                <button type="submit">Search</button>
            </form>
        </body>
        </html>
    `);
});

app.post('/search', (req, res) => {
    const searchTerm = req.body.searchTerm;
    const validation = validateInput(searchTerm);

    if (!validation.isValid) {
        const errorMessage = validation.type === 'xss' ? 'XSS attack detected!' : 'SQL injection attack detected!';
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Search App</title>
            </head>
            <body>
                <h1>Welcome to the Search App</h1>
                <p style="color: red;">${errorMessage} Please enter a valid search term.</p>
                <form action="/search" method="POST">
                    <label for="searchTerm">Enter Search Term:</label>
                    <input type="text" id="searchTerm" name="searchTerm" required>
                    <button type="submit">Search</button>
                </form>
            </body>
            </html>
        `);
    } else {
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Search Result</title>
            </head>
            <body>
                <h1>Search Result</h1>
                <p>You searched for: ${xssFilters.inHTMLData(searchTerm)}</p>
                <form action="/" method="GET">
                    <button type="submit">Go Back</button>
                </form>
            </body>
            </html>
        `);
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
