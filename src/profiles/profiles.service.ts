import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { CreateProfileDto } from './dto/create-profile.dto';
import type { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
    private profiles = [
        {
            id: randomUUID(),
            name: 'John Doe',
            description: 'John Doe Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
        },
        {
            id: randomUUID(),
            name: 'Jane Doe',
            description: 'Jane Doe Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
        }
    ];

    findAll() {
        return this.profiles;
    }

    findOne(id: string) {
        const profile = this.profiles.find(profile => profile.id === id);
        if (!profile) {
            throw new NotFoundException('Profile not found');
        }
        return profile;
    }

    create(createProfileDto: CreateProfileDto) {
        const newProfile = {
            id: randomUUID(),
            ...createProfileDto
        };
        this.profiles.push(newProfile);
        return newProfile;
    }

    update(id: string, updateProfileDto: UpdateProfileDto) {
        const profileIndex = this.profiles.findIndex(profile => profile.id == id);

        if (profileIndex !== -1) {
            // parse string id to uuid
            this.profiles[profileIndex] = {
                id: this.profiles[profileIndex].id,
                ...updateProfileDto
            };
            return this.profiles[profileIndex];
        }

        throw new NotFoundException('Profile not found');
    }

    remove(id: string) {
        const profileIndex = this.profiles.findIndex(profile => profile.id == id);
        
        if (profileIndex !== -1) {
            this.profiles.splice(profileIndex, 1);
            return true;
        }

        throw new NotFoundException('Profile not found');
    }
}