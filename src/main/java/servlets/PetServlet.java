/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import database.EditPetsTable;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import mainClasses.Pet;

/**
 *
 * @author Nikos Lasithiotakis
 */
@WebServlet(name = "Pet", urlPatterns = {"/Pet"})
public class PetServlet extends HttpServlet {

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
            out.println("<title>Servlet Pet</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet Pet at " + request.getContextPath() + "</h1>");
            out.println("</body>");
            out.println("</html>");
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
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // PrintStream fileOut = new PrintStream(new File("C:\\CSD\\PENDING\\HY-359\\PROJECT\\CS359-PROJECT\\src\\main\\java\\database\\logfile.txt"));
        // System.setOut(fileOut);
        String petId = request.getHeader("Pet-Id");
        if (petId.equals("-")) {
            String get_owner_id = String.valueOf(request.getHeader("owner_id"));
            System.out.println(get_owner_id);
            EditPetsTable ept = new EditPetsTable();
            Pet check = null;
            try {
                check = ept.petOfOwner(get_owner_id);
            } catch (SQLException | ClassNotFoundException ex) {
                Logger.getLogger(PetServlet.class.getName()).log(Level.SEVERE, null, ex);
            }
            if (check == null) {
                response.setStatus(500);
            } else {
                if (request.getHeader("Return").equals("Type")) {
                    response.getWriter().write(check.getType());
                } else {
                    response.getWriter().write(String.valueOf(check.getPet_id()));
                }
            }
        } else {
            try {
                EditPetsTable ept = new EditPetsTable();
                Pet pet = ept.petWithId(petId);
                String petJSON = ept.petToJSON(pet);
                response.getWriter().write(petJSON);
            } catch (SQLException | ClassNotFoundException ex) {
                Logger.getLogger(PetServlet.class.getName()).log(Level.SEVERE, null, ex);
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
