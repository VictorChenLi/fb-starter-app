import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const timetracking = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: `./static/mock-images/avatars/avatar_${index + 1}.jpg`,
  // avatarUrl: faker.image.technics(),
  name: faker.name.findName(),
  project: faker.name.jobArea(),
  isBilled: faker.datatype.boolean(),
  status: sample(['synced', 'new', 'error']),
  duration: faker.datatype.number({ min: 100, max: 9999 }),
}));

export default timetracking;
