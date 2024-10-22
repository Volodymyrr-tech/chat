import { Controller, Post, Body, Get, Param } from "@nestjs/common";
import { GroupsService } from "./groups.service";

@Controller("groups")
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  // Create a new group
  @Post()
  async createGroup(@Body() body: { name: string; userIds: string[] }) {
    return this.groupsService.createGroup(body.name, body.userIds);
  }

  // Add users to an existing group
  @Post(":groupId/users")
  async addUsersToGroup(
    @Param("groupId") groupId: string,
    @Body() body: { userIds: string[] }
  ) {
    return this.groupsService.addUsersToGroup(groupId, body.userIds);
  }

  // Get group by ID
  @Get(":groupId")
  async getGroupById(@Param("groupId") groupId: string) {
    return this.groupsService.getGroupById(groupId);
  }

  // Get all groups
  @Get()
  async getAllGroups() {
    return this.groupsService.getAllGroups();
  }

  @Post("join-or-create")
  async joinOrCreateGroup(@Body() body: { name: string; userIds: string[] }) {
    let group = await this.groupsService.findGroupByName(body.name);
    if (!group) {
      group = await this.groupsService.createGroup(body.name, body.userIds);
    }

    return group;
  }
}
