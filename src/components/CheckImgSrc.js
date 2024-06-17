import { CONFIG } from "./Global"

// Проверка существования картинки (в promise потому что асинхронная)
export default function CheckImgSrc(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        
        img.onload = () => {
            if (img.naturalWidth < CONFIG.PHOTO_PX_MIN 
                || img.naturalHeight < CONFIG.PHOTO_PX_MIN
                || img.naturalWidth > CONFIG.PHOTO_PX_MAX
                || img.naturalHeight > CONFIG.PHOTO_PX_MAX
            ) { // Если картинка больше или меньше заданных значений
                return reject(`Картинка не соответствуем допустимому размеру`)
            }
            
            resolve(src) // Если размер подходит 
        }

        img.onerror = () => { // Картинка не существует
            reject(`Не удалось загрузить картинку`)
        }
    })
}