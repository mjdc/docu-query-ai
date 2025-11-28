declare global {
  interface Window {
    pdfjsLib: any;
  }
}

const getPdfjsLib = () => {
  if (typeof window === 'undefined' || !window.pdfjsLib) {
    // This will be null during server-side rendering or if the script fails to load.
    return null; 
  }
  return window.pdfjsLib;
}

export async function extractTextFromPdf(file: File): Promise<string> {
  const pdfjsLib = getPdfjsLib();
  if (!pdfjsLib) {
    throw new Error("pdf.js library is not loaded.");
  }
  
  // The worker is needed to process the PDF.
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;

  const fileReader = new FileReader();

  return new Promise((resolve, reject) => {
    fileReader.onload = async function() {
      const typedarray = new Uint8Array(this.result as ArrayBuffer);
      try {
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          fullText += pageText + '\n\n';
        }
        resolve(fullText);
      } catch (error) {
        console.error("Error processing PDF:", error);
        reject(new Error("Could not extract text from the PDF."));
      }
    };

    fileReader.onerror = () => {
      reject(new Error("Failed to read the file."));
    };

    fileReader.readAsArrayBuffer(file);
  });
}