const { promises: Fs } = require('fs')
const mv = require('mv')
const fs = require('fs')
const path = require('path');
const sharp = require('sharp');
const {tmpUploadPath, uploadBasePath} = require('../config/siteConfig')

const fileExists = async (path) => {  
	try {
		await Fs.access(path)
		return true
	} catch {
		return false
	}
}

const moveFile = async (targetFile, destFile, existingFile = '') => {
	return new Promise(async (resolve, reject) => {
		try{
			if(existingFile && existingFile != ''){
				const prevFile = `${uploadBasePath}/${existingFile}`
				const fileExist = await fileExists(prevFile)
				if(fileExist){
					fs.unlinkSync(prevFile)
				}
			}
			
			await mv(`${tmpUploadPath}/${targetFile}`, `${uploadBasePath}/${destFile}`, {mkdirp: true}, function(err){})
			resolve(`${uploadBasePath}/${destFile}`)
		}catch(e){
			reject(e.message)
		}
	})
	
}

const resize = async(width, height, filePath, fileObj, existingFile = '') => {
	return new Promise(async (resolve, reject) => {
		const fileName = fileObj.filename
		console.log(existingFile);
		try{
			if(existingFile && existingFile != '' && existingFile != null){
				const prevFile = `${uploadBasePath}/${existingFile}`
				const fileExist = await fileExists(prevFile)
				if(fileExist){
					fs.unlinkSync(prevFile)
				}
			}
			
			if(!await fileExists(`${uploadBasePath}/${filePath}`)){
				await Fs.mkdir(`${uploadBasePath}/${filePath}`)
			}

			await sharp(path.resolve(fileObj.path))
			.resize(width, height)
			.toFile(
				path.resolve(uploadBasePath, filePath, `${width}X${height}-${fileName}`)
			)
			resolve(`${filePath}/${width}X${height}-${fileName}`)
		}catch(e){
			reject(e.message)
		}
	})
}

const removeFile = async (existingFile) => {
	return new Promise(async (resolve, reject) => {
		try{
			if(existingFile && existingFile != ''){
				const prevFile = `${uploadBasePath}/${existingFile}`
				const fileExist = await fileExists(prevFile)
				if(fileExist){
					fs.unlinkSync(prevFile)
				}
			}
			resolve(true)
		}catch(e){
			reject(e.message)
		}
	})
}

module.exports = {
    fileExists,
	moveFile,
	resize,
	removeFile
}