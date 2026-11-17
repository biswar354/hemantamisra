import { Component, DestroyRef, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Navbar } from '../navbar/navbar';
import { ArchiveArticle, ArticleArchiveService } from './article-archive';

@Component({
  imports: [Navbar, NgOptimizedImage, RouterLink],
  selector: 'app-article-detail',
  templateUrl: './article-detail.html',
})
export class ArticleDetail {
  protected readonly article = signal<ArchiveArticle | null>(null);
  protected readonly archiveError = signal<string | null>(null);
  protected readonly loading = signal(true);

  constructor(
    route: ActivatedRoute,
    private readonly articleArchive: ArticleArchiveService,
    destroyRef: DestroyRef,
  ) {
    route.paramMap.pipe(takeUntilDestroyed(destroyRef)).subscribe((params) => {
      void this.loadArticle(params.get('slug'));
    });
  }

  private async loadArticle(slug: string | null): Promise<void> {
    this.loading.set(true);
    this.archiveError.set(null);
    this.article.set(null);

    try {
      const archive = await this.articleArchive.load();
      const article = archive.find((item) => item.slug === slug);

      if (!article) {
        this.archiveError.set('This article could not be found.');
        return;
      }

      this.article.set(article);
    } catch (error) {
      console.error('Unable to load the selected article.', error);
      this.archiveError.set('The article could not be loaded. Please try again later.');
    } finally {
      this.loading.set(false);
    }
  }
}
