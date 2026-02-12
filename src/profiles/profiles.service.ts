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

    async findOne(
        profileWhereUniqueInput: Prisma.ProfileWhereUniqueInput,
    ): Promise<Profile | null> {
        const profile = await this.prisma.profile.findUnique({
            where: profileWhereUniqueInput,
        });

        if (!profile) {
            throw new NotFoundException(`Profile with id ${profileWhereUniqueInput.id} not found`);
        }

        return profile;
    }

    async findAll(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.ProfileWhereUniqueInput;
        where?: Prisma.ProfileWhereInput;
        orderBy?: Prisma.ProfileOrderByWithRelationInput;
    }): Promise<Profile[]> {
        const { skip, take, cursor, where, orderBy } = params;

        return await this.prisma.profile.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async create(data: CreateProfileDto): Promise<Profile> {
        try {
            return await this.prisma.profile.create({
                data: {
                    ...data,
                    id: randomUUID()
                }
            });
        } catch (error) {
            throw new HttpException('Failed to create profile', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async update(id: string, data: UpdateProfileDto): Promise<Profile> {
        try {
            return await this.prisma.profile.update({
                data: {
                    ...data
                },
                where: {
                    id
                }
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Profile with id ${id} not found`);
            }

            throw error;
        }
    }

    async remove(id: string): Promise<Profile> {
        try {
            return await this.prisma.profile.delete({
                where: {
                    id
                }
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Profile with id ${id} not found`);
            }

            throw error;
        }
    }

}
