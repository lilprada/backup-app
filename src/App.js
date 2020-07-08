import React, { useState, useEffect } from "react";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardTitle,
  MDBCardText,
  MDBBtn,
} from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import { User, UserTop, SpotifyApiContext } from "react-spotify-api";
import { SpotifyAuth, Scopes } from "react-spotify-auth";
import Cookies from "js-cookie";

import "./App.scss";
import Card from "./Card";
import samplePic from "./150.png";

const dev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";

const App = () => {
  const [spotifyAuthToken, setSpotifyAuthToken] = useState();

  useEffect(() => {
    setSpotifyAuthToken(Cookies.get("spotifyAuthToken"));
  }, [Cookies.get("spotifyAuthToken")]);

  const logout = () => {
    Cookies.remove("spotifyAuthoken", {
      path: dev ? "" : "react-spotify-auth",
    });
    window.location = dev ? "/" : "/react-spotify-auth";
  };

  return (
    <div className="stars">
      <div className="twinkling">
        <div className="app">
          <MDBContainer>
            {Cookies.get("spotifyAuthToken") ? (
              <>
                <SpotifyApiContext.Provider value={spotifyAuthToken}>
                  <User>
                    {(user) =>
                      user && user.data ? (
                        <>
                          <MDBRow>
                            <h1>Welcome back, {user.data.display_name}.</h1>
                          </MDBRow>
                          <MDBCol
                            style={{
                              maxWidth: "22rem",
                              padding: "0 0 1rem 1rem",
                            }}
                          >
                            <MDBCard>
                              <MDBCardImage
                                className="img-fluid"
                                src={
                                  user.data.images[0]
                                    ? user.data.images[0].url
                                    : samplePic
                                }
                                alt="Your Spotify Profile Picture"
                                waves
                              />
                              <MDBCardBody style={{ padding: "1rem" }}>
                                <MDBCardTitle>
                                  Glad to see you again.
                                </MDBCardTitle>
                                <MDBCardText>
                                  Here are some of your top tracks, as listed by
                                  Spotify.
                                </MDBCardText>
                              </MDBCardBody>
                            </MDBCard>
                          </MDBCol>
                        </>
                      ) : (
                        <p>Loading...</p>
                      )
                    }
                  </User>

                  <MDBRow className="columns">
                    <UserTop type="tracks">
                      {(tracks, loading, error) =>
                        tracks && tracks.data
                          ? tracks.data.items.map((track, ind) => {
                              return (
                                <>
                                  <Card track={track} />
                                </>
                              );
                            })
                          : null
                      }
                    </UserTop>
                  </MDBRow>
                </SpotifyApiContext.Provider>
                <MDBBtn onClick={logout}>Logout</MDBBtn>
              </>
            ) : (
              <div className="login-page">
                <h1>log into spotify:</h1>

                <div className="spotifyBtn">
                  <SpotifyAuth
                    redirectUri={dev ? "http://localhost:3000/callback" : ""}
                    clientID="6aa16b97a10b4a008623f89373142b03"
                    scopes={[
                      Scopes.userReadPrivate,
                      Scopes.userReadEmail,
                      "user-top-read",
                    ]}
                  />
                </div>
              </div>
            )}
          </MDBContainer>
        </div>
      </div>
    </div>
  );
};

export default App;
