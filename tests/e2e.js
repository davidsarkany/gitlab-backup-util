const exec = require('child_process').exec;
const dirCompare = require('dir-compare');
const dirCompareOptions = { compareSize: true, compareContent: true, excludeFilter: '/**/.git' };

const child = exec('node app.js',(error, stdout, stderr) =>
{
    if (error !== null)
        throw 'Backup process failed: ' + error;

    const res = dirCompare.compareSync('backup', 'tests/e2e_result', dirCompareOptions);
    if(!res.same)
        throw 'Backup files different than expected';
    console.log("E2E test successful");
});
