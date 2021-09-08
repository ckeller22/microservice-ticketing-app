import Link from "next/link";

const LandingPage = ({ currentUser, tickets }) => {
  const ticketCards = tickets.map((ticket) => {
    return (
      <div className="col">
        <div className="card">
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a>
              <img
                src="/images/ticket.png"
                className="card-img-top"
                alt="ticket image"
              />
            </a>
          </Link>
          <div className="card-body">
            <h5 className="card-title">
              {ticket.title} - ${ticket.price}
            </h5>
            <p className="card-text">
              In nisi nulla aliqua tempor cillum veniam aliquip sint ea
              excepteur magna eu.
            </p>
            <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
              <a className="btn btn-primary">View</a>
            </Link>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>
      <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-3">
        {ticketCards}
      </div>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/tickets");

  return { tickets: data };
};

export default LandingPage;
