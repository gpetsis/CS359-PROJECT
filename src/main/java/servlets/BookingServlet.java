/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
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
        } else {
            handleDeclineRequest(request, response);
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
        PrintStream fileOut = new PrintStream(new File("C:\\CSD\\PENDING\\HY-359\\PROJECT\\CS359-PROJECT\\src\\main\\java\\database\\logfile.txt"));
        System.setOut(fileOut);
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
        } else {
            String owner_id = request.getHeader("Type");
            ArrayList<Booking> books = new ArrayList<Booking>();
            EditBookingsTable ebt = new EditBookingsTable();
            boolean temp = false;
            try {
                books = ebt.ownerRequest(owner_id);
                for (int j = 0; j < books.size(); j++) {
                    Booking item = books.get(j);
                    System.out.println(item);
                    if (item.getStatus().equals("requested")) {
                        temp = true;
                    }
                }
                if (temp == true) {
                    response.setStatus(702);
                }
            } catch (SQLException | ClassNotFoundException ex) {
                Logger.getLogger(BookingServlet.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
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
        processRequest(request, response);
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
