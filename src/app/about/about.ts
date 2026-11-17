import { Component, OnInit, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { ImageCatalog, ImageCatalogService } from '../image-catalog';

@Component({
  imports: [Navbar, NgOptimizedImage],
  selector: 'app-about',
  styleUrl: './about.css',
  templateUrl: './about.html',
})
export class About implements OnInit {
  protected readonly catalog = signal<ImageCatalog | null>(null);
  protected readonly catalogError = signal<string | null>(null);

  constructor(private readonly imageCatalog: ImageCatalogService) {}

  ngOnInit(): void {
    void this.loadImages();
  }

  private async loadImages(): Promise<void> {
    try {
      this.catalog.set(await this.imageCatalog.load());
    } catch (error) {
      console.error('Unable to load the biography image.', error);
      this.catalogError.set('The artist image could not be loaded. Please try again later.');
    }
  }
}
