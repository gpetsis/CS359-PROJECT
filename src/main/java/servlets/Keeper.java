package servlets;

import database.EditBookingsTable;
import java.io.File;
import java.io.IOException;
import java.io.PrintStream;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import mainClasses.Booking;

public class Keeper extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head>");
            out.println("<title>Servlet Keeper</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet Keeper at " + request.getContextPath() + "</h1>");
            out.println("</body>");
            out.println("</html>");
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            PrintStream fileOut = new PrintStream(new File("C:\\CSD\\PENDING\\HY-359\\PROJECT\\CS359-PROJECT\\src\\main\\java\\database\\logfile.txt"));
            System.setOut(fileOut);
            String keeperId = request.getHeader("Keeper-Id");
            EditBookingsTable ebt = new EditBookingsTable();
            ArrayList<Booking> bookings = ebt.getKeeperRequests(keeperId);
            ArrayList<String> bookingsJSON = new ArrayList<String>();
            String bookingString;
            for (int i = 0; i < bookings.size(); i++) {
                Booking booking = bookings.get(i);
                bookingString = ebt.bookingToJSON(booking);
                System.out.println(bookingString);
                bookingsJSON.add(bookingString);
            }
            response.getWriter().write(bookingsJSON.toString());
        } catch (SQLException | ClassNotFoundException ex) {
            Logger.getLogger(Keeper.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    }

    @Override
    public String getServletInfo() {
        return "Short description";
    }

}
