import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class SetupDatabase {

    private static final String DB_URL =
            "jdbc:mysql://mysql-9ea700c-sushankvarshith16-afad.j.aivencloud.com:27678/foundit_db?sslMode=REQUIRED&allowMultiQueries=true";

    private static final String DB_USER = "avnadmin";

    public static void main(String[] args) {

        String password = System.getenv("DB_PASSWORD");

        if (password == null || password.isEmpty()) {
            System.out.println("ERROR: DB_PASSWORD is not set.");
            System.out.println("Run this first:");
            System.out.println("$env:DB_PASSWORD=\"YOUR_AIVEN_PASSWORD\"");
            return;
        }

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");

            System.out.println("Connecting to Aiven MySQL...");

            try (Connection connection =
                         DriverManager.getConnection(DB_URL, DB_USER, password);
                 Statement statement = connection.createStatement()) {

                System.out.println("Connected successfully!");


                // -------------------------------------------------
                // 1. Run schema.sql
                // -------------------------------------------------

                System.out.println("\nRunning schema.sql...");

                String schema = Files.readString(
                        Path.of("database", "schema.sql")
                );

                statement.execute(schema);

                System.out.println("schema.sql completed successfully!");


                // -------------------------------------------------
                // 2. Run seed_data.sql
                // -------------------------------------------------

                System.out.println("\nRunning seed_data.sql...");

                String seedData = Files.readString(
                        Path.of("database", "seed_data.sql")
                );

                statement.execute(seedData);

                System.out.println("seed_data.sql completed successfully!");


                System.out.println("\n=================================");
                System.out.println("DATABASE SETUP COMPLETE!");
                System.out.println("=================================");
                System.out.println("FoundIt database is ready on Aiven.");

            }

        } catch (Exception e) {

            System.out.println("\nDATABASE SETUP FAILED!");
            System.out.println("---------------------------------");

            e.printStackTrace();
        }
    }
}