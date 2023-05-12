const fs = require('fs');

function appendZeroToLength(value, length) {
	return `${value}`.padStart(length, '0');
}

function getDateAsText() {
	const now = new Date();
	const nowText = appendZeroToLength(now.getUTCFullYear(), 4) + '.'
		+ appendZeroToLength(now.getUTCMonth() + 1, 2) + '.'
		+ appendZeroToLength(now.getUTCDate(), 2) + ', '
		+ appendZeroToLength(now.getUTCHours(), 2) + ':'
		+ appendZeroToLength(now.getUTCMinutes(), 2) + ':'
		+ appendZeroToLength(now.getUTCSeconds(), 2) + '.'
		+ appendZeroToLength(now.getUTCMilliseconds(), 4) + ' UTC';
	return now.toISOString();
}

function logtofile(text, file = 'default.log', delimiter = '\n') {
	const logText = getDateAsText() + ' ' + text + delimiter;
	fs.appendFile(file, logText, 'utf8', function (error) {
		if (error) {
			console.log(getDateAsText() + ' ' + error);
		}
	});
}

const flog = (str) => {
	logtofile(str, process.env.LOG_FILE_NAME || "backend.log");
};

module.exports = flog;