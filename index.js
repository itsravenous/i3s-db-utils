/**
 * @file Main file
 * @author Tom Jenkins tom@itsravenous.com
 */

var fs = require('fs'),
	path = require('path'),
	fgpReader = require('i3s-fgp-reader');

/**
 * Provides the image filename corresponding to a fingerprint
 * @param {String} fingerprint filename
 * @return {String} image filename
 */
function getFGPImageName (fgpFile) {
	return fgpFile.split('.fgp')[0]+'.jpg';
}

/**
 * Fetches fingerprints for an individual
 * @param {String} individual ID
 * @return {Array}
 */
function getFingerprintsForAnimal(animalDir) {
	if (!fs.existsSync(animalDir) || !fs.statSync(animalDir).isDirectory()) {
		return false;
	}

	var fgpFiles = fs.readdirSync(animalDir).filter(function (entry) {
		return entry.split('.').pop().toLowerCase() == 'fgp';
	});

	var fgps = [];
	fgpFiles.forEach(function (fgpFile) {
		fgpFile = path.join(animalDir, fgpFile);
		var fgpData = fgpReader(fgpFile);
		fgps.push({
			id: path.basename(fgpFile, '.fgp'),
			fgp: fgpData,
			img64: fs.readFileSync(getFGPImageName(fgpFile)).toString('base64')
		});
	});
	return fgps;
}

/**
 * Fetches fingerprints for all individuals
 * @return {Array}
 */
function getAllFingerprints(dir) {
	var ids = fs.readdirSync(dir);
	var fgps = ids.map(function (id) {
		return getFingerprintsForAnimal(path.join(dir, id));
	}).filter(function (fgp) { return fgp; });
	return fgps;
}

module.exports = {
	getFGPImageName: getFGPImageName,
	getFingerprintsForAnimal: getFingerprintsForAnimal,
	getAllFingerprints: getAllFingerprints
}