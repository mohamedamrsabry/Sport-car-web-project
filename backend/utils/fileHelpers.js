const fs = require('fs');
const path = require('path');

const moveFolder = (oldPath, newPath) => {
    try {
        if (fs.existsSync(oldPath)) {
            fs.renameSync(oldPath, newPath);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error moving folder:', error);
        return false;
    }
};

const deleteFolder = (folderPath) => {
    try {
        if (fs.existsSync(folderPath)) {
            fs.rmSync(folderPath, { recursive: true, force: true });
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error deleting folder:', error);
        return false;
    }
};

const clearFolder = (folderPath) => {
    try {
        if (fs.existsSync(folderPath)) {
            const files = fs.readdirSync(folderPath);
            files.forEach(file => {
                fs.unlinkSync(path.join(folderPath, file));
            });
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error clearing folder:', error);
        return false;
    }
};

module.exports = {
    moveFolder,
    deleteFolder,
    clearFolder
};