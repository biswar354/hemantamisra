import { Routes } from '@angular/router';
import { Home } from './home/home';
import { About } from './about/about';
import { Paintings } from './paintings/paintings';
import { Articles } from './articles/articles';
import { ArticleDetail } from './articles/article-detail';
import { Contact } from './contact/contact';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
  { path: 'paintings', component: Paintings },
  { path: 'articles/:slug', component: ArticleDetail },
  { path: 'articles', component: Articles },
  { path: 'contact', component: Contact },
];
