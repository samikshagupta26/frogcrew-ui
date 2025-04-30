// Mock data for testing
export const mockData = {
  crewMembers: [
    {
      id: "1",
      userId: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phoneNumber: "123-456-7890",
      role: "CREW",
      position: ["Camera Operator"],
      active: true,
    },
    {
      id: "2",
      userId: "2",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      phoneNumber: "987-654-3210",
      role: "CREW",
      position: ["Director"],
      active: true,
    },
  ],

  positions: [
    {
      id: "1",
      name: "Director",
      displayName: "Director",
      description: "Game Director",
      defaultPayRate: 100,
    },
    {
      id: "2",
      name: "Camera Operator",
      displayName: "Camera Operator",
      description: "Camera Operator",
      defaultPayRate: 80,
    },
    {
      id: "3",
      name: "Producer",
      displayName: "Producer",
      description: "Game Producer",
      defaultPayRate: 90,
    },
  ],

  gameSchedules: [
    {
      id: "1",
      name: "Team A vs Team B Series",
      sport: "Basketball",
      season: "Spring 2024",
      startDate: "2024-06-01",
      endDate: "2024-08-31",
      active: true,
      status: "PUBLISHED",
    },
    {
      id: "2",
      name: "Summer 2024",
      sport: "Baseball",
      season: "Summer 2024",
      startDate: "2024-06-01",
      endDate: "2024-08-31",
      active: true,
      status: "DRAFT",
    },
  ],

  games: [
    {
      gameId: "1",
      scheduleId: "1",
      gameDate: "2024-06-15",
      venue: "Stadium A",
      opponent: "Team B",
      gameStart: "19:00",
      gameType: "Regular Season",
      finalized: false,
    },
    {
      gameId: "2",
      scheduleId: "1",
      gameDate: "2024-06-22",
      venue: "Stadium A",
      opponent: "Team B",
      gameStart: "20:00",
      gameType: "Regular Season",
      finalized: true,
    },
    {
      gameId: "3",
      scheduleId: "2",
      gameDate: "2024-07-01",
      venue: "Stadium B",
      opponent: "Team C",
      gameStart: "18:00",
      gameType: "Regular Season",
      finalized: false,
    },
  ],

  crewAssignments: [
    {
      id: "1",
      gameId: "1",
      userId: "1",
      position: { id: "2", name: "Camera Operator" },
      reportTime: "18:00",
      status: "CONFIRMED",
    },
  ],

  availability: [
    {
      id: "1",
      userId: "1",
      gameId: "1",
      status: "AVAILABLE",
      availability: true,
      comment: "Available for the game",
      submittedAt: "2024-06-01T10:00:00Z",
      lastModifiedAt: "2024-06-01T10:00:00Z",
      date: "2024-06-15",
      active: true,
    },
  ],
};

// Mock response format
export const createMockResponse = (data, message = "Success") => ({
  flag: true,
  code: 200,
  message,
  data,
});

// Mock error response
export const createMockError = (message = "Error", code = 500) => ({
  flag: false,
  code,
  message,
});
