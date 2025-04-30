import { mockData, createMockResponse, createMockError } from "./data";

// Simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockAdminService = {
  async getAllCrewMembers() {
    await delay(500);
    return { data: createMockResponse(mockData.crewMembers) };
  },

  async getPositions() {
    await delay(500);
    return { data: createMockResponse(mockData.positions) };
  },

  async deleteCrewMember(userId) {
    await delay(500);
    const index = mockData.crewMembers.findIndex(
      (member) => member.userId === userId
    );
    if (index !== -1) {
      mockData.crewMembers.splice(index, 1);
      return {
        data: createMockResponse({
          message: "Crew member deleted successfully",
        }),
      };
    }
    return { data: createMockError("Crew member not found", 404) };
  },

  async inviteCrewMembers(inviteData) {
    await delay(500);
    return {
      data: createMockResponse({ message: "Invitations sent successfully" }),
    };
  },
};

export const mockGameService = {
  async getGameSchedules() {
    await delay(500);
    return { data: createMockResponse(mockData.gameSchedules) };
  },

  async createGameSchedule(scheduleData) {
    await delay(500);
    const newSchedule = { ...scheduleData, id: Date.now().toString() };
    mockData.gameSchedules.push(newSchedule);
    return { data: createMockResponse(newSchedule) };
  },

  async addGame(gameRequest) {
    await delay(500);
    const newGame = { ...gameRequest, gameId: Date.now().toString() };
    mockData.games.push(newGame);
    return { data: createMockResponse(newGame) };
  },

  async getAllGames() {
    await delay(500);
    return { data: createMockResponse(mockData.games) };
  },

  async getGameDetails(gameId) {
    await delay(500);
    const game = mockData.games.find((g) => g.gameId === gameId);
    if (game) {
      return { data: createMockResponse(game) };
    }
    return { data: createMockError("Game not found", 404) };
  },

  async getGamesForSchedule(scheduleId) {
    await delay(500);
    const games = mockData.games.filter((g) => g.scheduleId === scheduleId);
    return { data: createMockResponse(games) };
  },

  async getGameCrewList(gameId) {
    await delay(500);
    const assignments = mockData.crewAssignments.filter(
      (a) => a.gameId === gameId
    );
    return { data: createMockResponse(assignments) };
  },

  async scheduleCrewForGame(gameId, assignmentData) {
    await delay(500);
    const newAssignment = {
      ...assignmentData,
      id: Date.now().toString(),
      gameId,
    };
    mockData.crewAssignments.push(newAssignment);
    return { data: createMockResponse(newAssignment) };
  },

  async removeCrewAssignment(gameId, assignmentId) {
    await delay(500);
    const index = mockData.crewAssignments.findIndex(
      (a) => a.id === assignmentId && a.gameId === gameId
    );
    if (index !== -1) {
      mockData.crewAssignments.splice(index, 1);
      return {
        data: createMockResponse({
          message: "Assignment removed successfully",
        }),
      };
    }
    return { data: createMockError("Assignment not found", 404) };
  },

  async getUserAvailability(userId) {
    await delay(500);
    const availability = mockData.availability.filter(
      (a) => a.userId === userId
    );
    return { data: createMockResponse(availability) };
  },
};

export const mockCrewService = {
  async createCrewMember(crewData) {
    await delay(500);
    const newMember = {
      ...crewData,
      id: Date.now().toString(),
      userId: Date.now().toString(),
    };
    mockData.crewMembers.push(newMember);
    return { data: createMockResponse(newMember) };
  },

  async getCrewMemberProfile(userId) {
    await delay(500);
    const member = mockData.crewMembers.find((m) => m.userId === userId);
    if (member) {
      return { data: createMockResponse(member) };
    }
    return { data: createMockError("Crew member not found", 404) };
  },

  async updateCrewMember(userId, updateData) {
    await delay(500);
    const index = mockData.crewMembers.findIndex((m) => m.userId === userId);
    if (index !== -1) {
      mockData.crewMembers[index] = {
        ...mockData.crewMembers[index],
        ...updateData,
      };
      return { data: createMockResponse(mockData.crewMembers[index]) };
    }
    return { data: createMockError("Crew member not found", 404) };
  },

  async submitAvailability(availabilityData) {
    await delay(500);
    const newAvailability = { ...availabilityData, id: Date.now().toString() };
    mockData.availability.push(newAvailability);
    return { data: createMockResponse(newAvailability) };
  },
};
