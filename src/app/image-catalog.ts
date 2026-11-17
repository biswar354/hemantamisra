import { Injectable } from '@angular/core';

export interface PaintingImage {
  title: string;
  src: string;
}

export interface PublicationImage {
  title: string;
  src: string;
}

export interface ImageCatalog {
  covers: string[];
  paintings: PaintingImage[];
  archive: string[];
  featured: {
    hero: string;
    about: string;
    collection: [PaintingImage, PaintingImage, PaintingImage];
    echo: string;
    harvest: string;
    calcuttaGroup: string;
  };
  publications: PublicationImage[];
}

@Injectable({ providedIn: 'root' })
export class ImageCatalogService {
  private catalogRequest?: Promise<ImageCatalog>;

  load(): Promise<ImageCatalog> {
    if (!this.catalogRequest) {
      this.catalogRequest = fetch('/assets/image-catalog.json')
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Image catalog request failed: ${response.status}`);
          }

          return response.json() as Promise<ImageCatalog>;
        })
        .catch((error: unknown) => {
          this.catalogRequest = undefined;
          throw error;
        });
    }

    return this.catalogRequest;
  }
}
