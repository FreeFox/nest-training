import { Controller, Get, Query, Param, Post, Body, Put, Delete, HttpCode, HttpStatus, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfilesService } from './profiles.service';
import { ProfilesGuard } from './profiles.guard';
import type { UUID } from 'crypto';

@Controller('profiles')
@UseGuards(ProfilesGuard)
export class ProfilesController {
    constructor(private readonly profilesService: ProfilesService) {}

    // GET /profiles
    @Get()
    findAll(@Query('age') age: number) {
        return this.profilesService.findAll();
    }

    // GET /profiles/:id
    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: UUID) {
        return this.profilesService.findOne(id);
    }

    @Post()
    create(@Body() createProfileDto: CreateProfileDto) {
        return this.profilesService.create(createProfileDto);
    }

    @Put(':id')
    update(@Param('id', ParseUUIDPipe) id: UUID, @Body() updateProfileDto: UpdateProfileDto) {
        const updatedProfile = this.profilesService.update(id, updateProfileDto);

        return updatedProfile;
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseUUIDPipe) id: UUID) {
        const isDeleted = this.profilesService.remove(id);
        
        return {"deleted": isDeleted};
    }

}
