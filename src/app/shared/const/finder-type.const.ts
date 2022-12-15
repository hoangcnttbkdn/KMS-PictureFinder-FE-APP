import { FinderByType } from '../enums/finder-type.enum';

export const FINDER_TYPES = [
  {
    id: FinderByType.Face,
    name: 'Face',
    description: 'Find image by face.',
    url: './assets/images/face-detection.png',
  },
  {
    id: FinderByType.Clothes,
    name: 'Clothes',
    description: 'Find image by clothes.',
    url: './assets/images/clothes.png',
  },
  {
    id: FinderByType.BIB,
    name: 'BIB',
    description:
      'Find image by bib.',
      url: './assets/images/bib.png',
  },
];
