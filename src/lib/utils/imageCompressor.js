export async function compressImageToWebP(file, maxWidth = 1200, quality = 0.8) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = (event) => {
			const img = new Image();
			img.src = event.target.result;
			img.onload = () => {
				const canvas = document.createElement('canvas');
				let width = img.width;
				let height = img.height;

				if (width > maxWidth) {
					height = Math.round((height * maxWidth) / width);
					width = maxWidth;
				}

				canvas.width = width;
				canvas.height = height;

				const ctx = canvas.getContext('2d');
				// Fill background with white in case of transparent png
				ctx.fillStyle = '#FFFFFF';
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(img, 0, 0, width, height);

				canvas.toBlob(
					(blob) => {
						if (blob) {
							// Create a new File from the blob
							const newFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
							const newFile = new File([blob], newFileName, {
								type: 'image/webp',
								lastModified: Date.now()
							});
							resolve(newFile);
						} else {
							reject(new Error('Canvas to Blob failed'));
						}
					},
					'image/webp',
					quality
				);
			};
			img.onerror = (error) => reject(error);
		};
		reader.onerror = (error) => reject(error);
	});
}
