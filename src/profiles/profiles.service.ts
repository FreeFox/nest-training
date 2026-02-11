import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { CreateProfileDto } from './dto/create-profile.dto';
import type { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from '../prisma.service';
import { Profile } from 'src/generated/prisma/client';
import { Prisma } from 'src/generated/prisma/client';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ProfilesService {
    constructor(private prisma: PrismaService) {}

    async profile(
        profileWhereUniqueInput: Prisma.ProfileWhereUniqueInput,
    ): Promise<Profile | null> {
        return this.prisma.profile.findUnique({
            where: profileWhereUniqueInput,
        });
    }

    async profilesAll(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.ProfileWhereUniqueInput;
        where?: Prisma.ProfileWhereInput;
        orderBy?: Prisma.ProfileOrderByWithRelationInput;
    }): Promise<Profile[]> {
        const { skip, take, cursor, where, orderBy } = params;

        return this.prisma.profile.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

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
            throw new NotFoundException(`Profile ${id} not found`);
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

        if (profileIndex === -1) {
            throw new NotFoundException(`Profile ${id} not found`);
        }

        // parse string id to uuid
        this.profiles[profileIndex] = {
            id: this.profiles[profileIndex].id,
            ...updateProfileDto
        };

        return this.profiles[profileIndex];
    }

    remove(id: string) {
        const profileIndex = this.profiles.findIndex(profile => profile.id == id);
        
        if (profileIndex === -1) {
            throw new NotFoundException(`Profile ${id} not found`);
        }

        this.profiles.splice(profileIndex, 1);
        return true;
    }
}