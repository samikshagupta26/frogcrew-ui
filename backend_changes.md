# Backend Changes Required

## 1. Create Invitation Entity

```java
@Entity
@Table(name = "invitations")
public class Invitation {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String token;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private boolean used = false;

    // getters, setters, etc.
}
```

## 2. Create InvitationRepository

```java
@Repository
public interface InvitationRepository extends JpaRepository<Invitation, String> {
    Optional<Invitation> findByTokenAndUsedFalseAndExpiresAtAfter(String token, LocalDateTime now);
    List<Invitation> findByEmail(String email);
    void deleteByExpiresAtBefore(LocalDateTime date);
}
```

## 3. Create InvitationService

```java
@Service
public class InvitationService {

    @Value("${app.invitation.expiry-days:7}")
    private int expiryDays;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Autowired
    private InvitationRepository invitationRepository;

    @Autowired
    private EmailService emailService;

    public List<InvitationResponseDTO> createInvitations(List<String> emails) {
        List<InvitationResponseDTO> results = new ArrayList<>();

        for (String email : emails) {
            Invitation invitation = new Invitation();
            invitation.setEmail(email);
            invitation.setExpiresAt(LocalDateTime.now().plusDays(expiryDays));

            invitation = invitationRepository.save(invitation);

            String inviteLink = frontendUrl + "/register/crew?token=" + invitation.getToken();

            // Send email
            String emailBody = createInvitationEmail(inviteLink, expiryDays);
            emailService.sendEmail(email, "You're invited to join FrogCrew", emailBody);

            // Add to results
            InvitationResponseDTO dto = new InvitationResponseDTO();
            dto.setEmail(email);
            dto.setToken(invitation.getToken());
            dto.setInviteLink(inviteLink);
            dto.setExpiresAt(invitation.getExpiresAt());

            results.add(dto);
        }

        return results;
    }

    public Optional<Invitation> validateToken(String token) {
        return invitationRepository.findByTokenAndUsedFalseAndExpiresAtAfter(token, LocalDateTime.now());
    }

    public void markAsUsed(String token) {
        invitationRepository.findById(token).ifPresent(invitation -> {
            invitation.setUsed(true);
            invitationRepository.save(invitation);
        });
    }

    private String createInvitationEmail(String inviteLink, int expiryDays) {
        return "Hello,\n\n" +
               "You have been invited to join FrogCrew. Please click the link below to register:\n\n" +
               inviteLink + "\n\n" +
               "This invitation will expire in " + expiryDays + " days.\n\n" +
               "Best regards,\n" +
               "The FrogCrew Team";
    }

    // Scheduled task to clean up expired invitations
    @Scheduled(cron = "0 0 0 * * *") // Run daily at midnight
    public void cleanupExpiredInvitations() {
        invitationRepository.deleteByExpiresAtBefore(LocalDateTime.now());
    }
}
```

## 4. Create API Endpoints

### InvitationController

```java
@RestController
@RequestMapping("/api/invitations")
public class InvitationController {

    @Autowired
    private InvitationService invitationService;

    @GetMapping("/validate")
    public ResponseEntity<?> validateInvitation(@RequestParam String token) {
        Optional<Invitation> invitation = invitationService.validateToken(token);

        if (invitation.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("flag", true);
            response.put("code", 200);
            response.put("message", "Valid invitation");

            Map<String, String> data = new HashMap<>();
            data.put("email", invitation.get().getEmail());
            response.put("data", data);

            return ResponseEntity.ok(response);
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("flag", false);
            response.put("code", 404);
            response.put("message", "Invalid or expired invitation");

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}
```

### InviteController (for admins)

```java
@RestController
@RequestMapping("/api/invite")
public class InviteController {

    @Autowired
    private InvitationService invitationService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> inviteCrewMembers(@RequestBody InviteRequest request) {
        try {
            List<InvitationResponseDTO> invitations = invitationService.createInvitations(request.getEmails());

            Map<String, Object> response = new HashMap<>();
            response.put("flag", true);
            response.put("code", 200);
            response.put("message", "Invitations sent successfully");
            response.put("data", invitations);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("flag", false);
            response.put("code", 500);
            response.put("message", "Failed to send invitations: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
```

### CrewMemberController

```java
@RestController
@RequestMapping("/api/crewMember")
public class CrewMemberController {

    @Autowired
    private UserService userService;

    @Autowired
    private InvitationService invitationService;

    @PostMapping
    public ResponseEntity<?> registerCrewMember(
            @RequestBody CrewMemberRequest request,
            @RequestHeader("Invitation-Token") String token) {

        // Validate invitation token
        Optional<Invitation> invitation = invitationService.validateToken(token);

        if (!invitation.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("flag", false);
            response.put("code", 404);
            response.put("message", "Invalid or expired invitation");

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        // Verify email matches invitation
        if (!invitation.get().getEmail().equals(request.getEmail())) {
            Map<String, Object> response = new HashMap<>();
            response.put("flag", false);
            response.put("code", 400);
            response.put("message", "Email does not match invitation");

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        try {
            // Register user
            UserDTO createdUser = userService.createUser(request);

            // Mark invitation as used
            invitationService.markAsUsed(token);

            Map<String, Object> response = new HashMap<>();
            response.put("flag", true);
            response.put("code", 200);
            response.put("message", "Crew member registered successfully");
            response.put("data", createdUser);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("flag", false);
            response.put("code", 500);
            response.put("message", "Registration failed: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
```

## 5. Update User Service (if needed)

Ensure your UserService can handle the CrewMemberRequest with the required fields:

- email
- firstName
- lastName
- password
- phoneNumber
- role (always "CREW" for invited users)
- position (array of position IDs or empty array)

## 6. Email Configuration

Ensure your Spring Boot application has email sending capabilities configured:

```java
@Configuration
public class EmailConfig {

    @Value("${spring.mail.host}")
    private String host;

    @Value("${spring.mail.port}")
    private int port;

    @Value("${spring.mail.username}")
    private String username;

    @Value("${spring.mail.password}")
    private String password;

    @Bean
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(host);
        mailSender.setPort(port);
        mailSender.setUsername(username);
        mailSender.setPassword(password);

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");

        return mailSender;
    }
}
```

## 7. Add Required Properties

Update your application.properties or application.yml file:

```properties
# Frontend URL for invitation links
app.frontend.url=http://localhost:3000

# Invitation expiry in days
app.invitation.expiry-days=7

# Mail configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

## 8. Update Security Configuration

Ensure your security configuration allows these endpoints:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // ... existing configuration
            .authorizeHttpRequests(authz -> authz
                // Public endpoints
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/invitations/validate").permitAll()
                .requestMatchers("/api/crewMember").permitAll()
                // Admin endpoints
                .requestMatchers("/api/invite").hasRole("ADMIN")
                // Other endpoints
                .anyRequest().authenticated()
            );

        return http.build();
    }

    // ... existing beans
}
```
