import { Component, OnInit, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { ArchiveArticle, ArticleArchiveService } from './article-archive';

@Component({
  imports: [Navbar, NgOptimizedImage, RouterLink],
  selector: 'app-articles',
  templateUrl: './articles.html',
})
export class Articles implements OnInit {
  protected readonly articles = signal<ArchiveArticle[]>([]);
  protected readonly archiveError = signal<string | null>(null);

  constructor(private readonly articleArchive: ArticleArchiveService) {}

  ngOnInit(): void {
    void this.loadArticles();
  }

  private async loadArticles(): Promise<void> {
    try {
      this.articles.set(await this.articleArchive.load());
    } catch (error) {
      console.error('Unable to load the article archive.', error);
      this.archiveError.set('The article archive could not be loaded. Please try again later.');
    }
  }
}
