import { Injectable } from '@angular/core';

export interface ArchiveArticle {
  slug: string;
  title: string;
  author: string;
  credit: string;
  image: string;
  imageAlt: string;
  excerpt: string;
  paragraphs: string[];
  source: string;
}

@Injectable({ providedIn: 'root' })
export class ArticleArchiveService {
  private articlesRequest?: Promise<ArchiveArticle[]>;

  load(): Promise<ArchiveArticle[]> {
    if (!this.articlesRequest) {
      this.articlesRequest = fetch('/assets/articles.json')
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Article archive request failed: ${response.status}`);
          }

          return response.json() as Promise<ArchiveArticle[]>;
        })
        .catch((error: unknown) => {
          this.articlesRequest = undefined;
          throw error;
        });
    }

    return this.articlesRequest;
  }
}
