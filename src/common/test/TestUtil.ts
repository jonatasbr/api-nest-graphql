import { User } from '../../user/user.entity';

export default class TestUtil {
  static giveMeAValidUserMock(): User {
    const user = new User();
    user.id = '1';
    user.name = 'Fulano';
    user.email = 'fulano@mail.com';
    user.password = 'pass1234';
    return user;
  }
}
