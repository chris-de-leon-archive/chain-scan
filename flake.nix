# https://github.com/NixOS/nixpkgs/commit/ad98f879fded1fa7b95d884db0b606f1ead1e904
{
  inputs = {
    nixpkgs.url = "https://github.com/NixOS/nixpkgs/archive/ad98f879fded1fa7b95d884db0b606f1ead1e904.tar.gz";
    secrets.url = "https://github.com/chris-de-leon/secrets-cli/archive/refs/tags/v1.1.0.tar.gz";
    utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, secrets, utils }:
    utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          overlays = [
            (final: prev: {
              scli = secrets.defaultPackage.${prev.system};
            })
          ];
        };
      in
      rec {
        formatter = pkgs.nixpkgs-fmt;

        devShells.default = pkgs.mkShell {
          packages = [
            pkgs.bashInteractive
            pkgs.lastpass-cli
            pkgs.sqlite
            pkgs.nodejs
            pkgs.scli
            pkgs.bun
          ];
        };
      }
    );
}

