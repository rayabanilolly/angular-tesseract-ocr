import { Component, VERSION } from "@angular/core";
import { createWorker } from "tesseract.js";
import { DomSanitizer } from "@angular/platform-browser";
import { ImageCroppedEvent } from "ngx-image-cropper";
@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  name = "Angular " + VERSION.major;

  worker: Tesseract.Worker = createWorker();
  isReady: boolean;
  imageChangedEvent: any;
  base64Image: any;
  ocrResult: string;
  croppedImage: any = "";
  isScanning: boolean;

  constructor() {
    this.initialize();
  }
  async initialize(): Promise<void> {
    await this.worker.load();
    await this.worker.loadLanguage("eng");
    await this.worker.initialize("eng");
    this.isReady = true;
  }
  handleFileInput(event): void {
    //  console.log(event);

    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      this.imageChangedEvent = event;

      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (event: any) => {
        this.base64Image = event.target.result;
        event.target.result = null;
      };
    }
  }

  scanOCR() {
    this.isScanning = true;
    this.imageChangedEvent = null;
    this.doOCR(this.croppedImage);
  }
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent): void {
    console.log(event);
    //this.doOCR(event.base64);
    this.croppedImage = event.base64;
    this.base64Image = event.base64;
  }

  async doOCR(base64Image: string) {
    this.ocrResult = "Scanning";
    console.log(`Started: ${new Date()}`);
    if (this.isReady) {
      const data = await this.worker.recognize(base64Image);
      console.log(data);
      this.ocrResult = data.data.text;
    }
    // await this.worker.terminate();
    console.log(`Stopped: ${new Date()}`);
    this.isScanning = false;
  }

  transform(): string {
    return this.base64Image;
  }
}
