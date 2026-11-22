import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

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
  private readonly document = inject(DOCUMENT);
  private articlesRequest?: Promise<ArchiveArticle[]>;

  load(): Promise<ArchiveArticle[]> {
    if (!this.articlesRequest) {
      this.articlesRequest = fetch(new URL('assets/articles.json', this.document.baseURI), {
        cache: 'no-cache',
      })
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
