/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import database.EditBookingsTable;
import database.EditPetKeepersTable;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import mainClasses.Booking;

@WebServlet(name = "BookingServlet", urlPatterns = {"/BookingServlet"})
public class BookingServlet extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            /* TODO output your page here. You may use following sample code. */
            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head>");
            out.println("<title>Servlet BookingServlet</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet BookingServlet at " + request.getContextPath() + "</h1>");
            out.println("</body>");
            out.println("</html>");
        }
    }

    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String requestType = request.getHeader("Request-Type");
        if (requestType.equals("Accept-Request")) {
            handleAcceptRequest(request, response);
        } else if (requestType.equals("Decline-Request")) {
            handleDeclineRequest(request, response);
        } else if (requestType.equals("Finished-Request")) {
            handleFinishRequest(request, response);
        }
    }

    protected void handleFinishRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        EditBookingsTable ebt = new EditBookingsTable();
        String owner_id = request.getHeader("owner_id");
        try {
            ebt.setStatusFinished(owner_id);
        } catch (SQLException | ClassNotFoundException ex) {
            Logger.getLogger(BookingServlet.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    protected void handleAcceptRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            EditBookingsTable ebt = new EditBookingsTable();
            String bookingId = request.getHeader("Booking-Id");
            ebt.updateBooking(Integer.valueOf(bookingId), "accepted");
        } catch (SQLException | ClassNotFoundException ex) {
            response.setStatus(409);
            Logger.getLogger(BookingServlet.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    protected void handleDeclineRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            EditBookingsTable ebt = new EditBookingsTable();
            String bookingId = request.getHeader("Booking-Id");
            ebt.updateBooking(Integer.valueOf(bookingId), "declined");
        } catch (SQLException | ClassNotFoundException ex) {
            response.setStatus(409);
            Logger.getLogger(BookingServlet.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
//        PrintStream fileOut = new PrintStream(new File("C:\\Users\\Nikos Lasithiotakis\\Desktop\\CSD\\5ο Εξάμηνο\\ΗΥ359\\CS359-PROJECT\\src\\main\\webapp\\logfile.txt"));
//        System.setOut(fileOut);
        String header = request.getHeader("Request-Type");
        if (header.equals("Get-Keeping")) {
            try {
                String keeper_id = request.getHeader("Keeper-Id");
                EditBookingsTable ebt = new EditBookingsTable();
                Booking booking = ebt.getKeeperCurrentKeeping(keeper_id);
                response.getWriter().write(ebt.bookingToJSON(booking));
                System.out.println(ebt.bookingToJSON(booking));
            } catch (SQLException | ClassNotFoundException ex) {
                response.setStatus(409);
                System.out.println("Error: " + ex);
                Logger.getLogger(BookingServlet.class.getName()).log(Level.SEVERE, null, ex);
            }
        } else if (header.equals("Get-Statistics")) {
            String keeper_id = request.getHeader("Keeper-Id");
            EditBookingsTable ebt = new EditBookingsTable();
            ArrayList<Booking> bookings = ebt.getTotalBookingsFinished(keeper_id);
            int numberOfBookings = bookings.size();
            int numberOfDays = 0;

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

            Booking booking;
            for (int i = 0; i < numberOfBookings; i++) {
                booking = bookings.get(i);
                LocalDate fromDate = LocalDate.parse(booking.getFromDate(), formatter);
                LocalDate toDate = LocalDate.parse(booking.getToDate(), formatter);

                long daysDifference = ChronoUnit.DAYS.between(fromDate, toDate);
                numberOfDays += daysDifference;
            }

            System.out.println(numberOfBookings);
            System.out.println(numberOfDays);
            response.getWriter().write("{\"numberOfDays\":\"" + numberOfDays + "\", \"numberOfBookings\":\"" + numberOfBookings + "\"}");
        } else if (header.equals("FinishedBookings")) {
            String owner_id = request.getHeader("owner_id");
            System.out.println(owner_id);
            ArrayList<Booking> books = new ArrayList<Booking>();
            EditBookingsTable ebt = new EditBookingsTable();
            boolean temp = false;
            ArrayList<Booking> allFinishedBookings = new ArrayList<Booking>();
            try {
                books = ebt.ownerRequest(owner_id);
                for (int j = 0; j < books.size(); j++) {
                    Booking item = books.get(j);
                    System.out.println(item);
                    if (item.getStatus().equals("finished")) {
                        temp = true;
                        allFinishedBookings.add(books.get(j));
                    }
                }
                if (temp == true) {
                    ArrayList<String> bookingToString = new ArrayList<String>();
                    String tempBooking;
                    for (int k = 0; k < allFinishedBookings.size(); k++) {
                        tempBooking = ebt.bookingToJSON(allFinishedBookings.get(k));
                        bookingToString.add(tempBooking);
                    }
                    response.getWriter().write(bookingToString.toString());
                    response.setStatus(703);
                }
            } catch (SQLException | ClassNotFoundException ex) {
                Logger.getLogger(BookingServlet.class.getName()).log(Level.SEVERE, null, ex);
            }
        } else if (header.equals("KeeperInfo")) {
            String keeper_ids = request.getHeader("KeeperIds");
            String[] keyValuePairs = keeper_ids.substring(1, keeper_ids.length() - 1).split(",");
            List<String> valuesList = new ArrayList<>();
            for (String pair : keyValuePairs) {
                String[] keyValue = pair.split(":");
                int value = Integer.parseInt(keyValue[1].trim());
                String stringvalue = String.valueOf(value);
                valuesList.add(stringvalue);
            }
            System.out.println(valuesList);
            List<String> uniqueValuesList = removeDuplicates(valuesList);
            ArrayList<String> keepers = new ArrayList<String>();
            EditPetKeepersTable ept = new EditPetKeepersTable();
            for (int q = 0; q < uniqueValuesList.size(); q++) {
                try {
                    keepers.add(ept.getKeepersById(uniqueValuesList.get(q)));
                } catch (SQLException | ClassNotFoundException ex) {
                    response.setStatus(500);
                    Logger.getLogger(BookingServlet.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
            response.getWriter().write(keepers.toString());
        } else {
            String owner_id = request.getHeader("Request-Type");
            System.out.println(owner_id);
            ArrayList<Booking> books = new ArrayList<Booking>();
            EditBookingsTable ebt = new EditBookingsTable();
            boolean req = false;
            boolean acc = false;
            Booking curBooking = new Booking();
            try {
                books = ebt.ownerRequest(owner_id);
                for (int j = 0; j < books.size(); j++) {
                    Booking item = books.get(j);
                    System.out.println(item);
                    if (item.getStatus().equals("requested")) {
                        req = true;
                    }
                    if (item.getStatus().equals("accepted")) {
                        curBooking = books.get(j);
                        acc = true;
                    }
                }
                if (acc == true) {
                    response.getWriter().write(ebt.bookingToJSON(curBooking));
                    response.setStatus(703);
                } else if (req == true) {
                    response.setStatus(702);
                }
            } catch (SQLException | ClassNotFoundException ex) {
                Logger.getLogger(BookingServlet.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    public static List<String> removeDuplicates(List<String> list) {
        Set<String> set = new HashSet<>(list);
        return new ArrayList<>(set);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
//        PrintStream fileOut = new PrintStream(new File("C:\\Users\\Nikos Lasithiotakis\\Desktop\\CSD\\5ο Εξάμηνο\\ΗΥ359\\CS359-PROJECT\\src\\main\\webapp\\logfile.txt"));
//        System.setOut(fileOut);
        String requestString = "";
        BufferedReader in = new BufferedReader(new InputStreamReader(request.getInputStream()));
        String line = in.readLine();
        while (line != null) {
            requestString += line;
            line = in.readLine();
        }
        System.out.println(requestString);
        EditBookingsTable ebt = new EditBookingsTable();
        try {
            ebt.addBookingFromJSON(requestString);
        } catch (ClassNotFoundException ex) {
            response.setStatus(702);
            Logger.getLogger(BookingServlet.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
