import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/users/entities/users.entity';

/** 이 데코레이터는 metadata를 설정한다. */
export type AllowedRoles = keyof typeof UserRole | 'Any';

/** Role 데코레이터 roles라는 이름으로 데코레이터에 들어온 값과 키 밸류로 가진다.*/
export const Role = (roles: AllowedRoles[]) => SetMetadata('roles', roles);
