import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Get('me')
    me(@Req() request: any ) {

      return this.userService.getUserById(request.userId);
    }
}
