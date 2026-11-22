import { Component, ElementRef, OnInit, signal, viewChild } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { ImageCatalogService, PaintingImage } from '../image-catalog';

@Component({
  imports: [Navbar, NgOptimizedImage],
  selector: 'app-paintings',
  templateUrl: './paintings.html',
})
export class Paintings implements OnInit {
  protected readonly works = signal<PaintingImage[]>([]);
  protected readonly catalogError = signal<string | null>(null);
  protected readonly selectedWork = signal<PaintingImage | null>(null);
  protected readonly activeIndex = signal(0);
  private readonly artworkDialog =
    viewChild.required<ElementRef<HTMLDialogElement>>('artworkDialog');

  constructor(private readonly imageCatalog: ImageCatalogService) {}

  ngOnInit(): void {
    void this.loadImages();
  }

  private async loadImages(): Promise<void> {
    try {
      const catalog = await this.imageCatalog.load();
      this.works.set(catalog.paintings);
    } catch (error) {
      console.error('Unable to load the painting gallery.', error);
      this.catalogError.set('The painting gallery could not be loaded. Please try again later.');
    }
  }

  protected openArtwork(work: PaintingImage): void {
    this.selectedWork.set(work);
    this.artworkDialog().nativeElement.showModal();
  }

  protected closeArtwork(): void {
    this.artworkDialog().nativeElement.close();
  }

  protected closeArtworkOnBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeArtwork();
    }
  }

  protected showPreviousArtwork(): void {
    const currentWork = this.selectedWork();
    if (!currentWork) return;

    const works = this.works();
    const currentIndex = works.indexOf(currentWork);
    const previousIndex = (currentIndex - 1 + works.length) % works.length;
    this.selectedWork.set(works[previousIndex]);
  }

  protected showNextArtwork(): void {
    const currentWork = this.selectedWork();
    if (!currentWork) return;

    const works = this.works();
    const currentIndex = works.indexOf(currentWork);
    const nextIndex = (currentIndex + 1) % works.length;
    this.selectedWork.set(works[nextIndex]);
  }

  protected onArtworkKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.showPreviousArtwork();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.showNextArtwork();
    }
  }

  protected clearSelectedWork(): void {
    this.selectedWork.set(null);
  }

  protected artworkNumber(work: PaintingImage): string {
    return String(this.works().indexOf(work) + 1).padStart(2, '0');
  }

  protected goToPainting(index: number): void {
    const works = this.works();
    if (!works.length) return;
    this.activeIndex.set((index + works.length) % works.length);
  }

  protected showPreviousPainting(): void {
    this.goToPainting(this.activeIndex() - 1);
  }

  protected showNextPainting(): void {
    this.goToPainting(this.activeIndex() + 1);
  }

  protected onCarouselKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.showPreviousPainting();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.showNextPainting();
    }
  }
}
