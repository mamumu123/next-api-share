self.onmessage = async (event) => {
    const { src } = event.data;

    try {
        const response = await fetch(src);
        const blob = await response.blob();

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            const base64data = reader.result;
            self.postMessage(base64data);
        };
    } catch (error) {
        console.error('Image loading failed in worker:', error);
        self.postMessage(null);
    }
};
