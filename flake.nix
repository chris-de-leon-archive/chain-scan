# https://github.com/NixOS/nixpkgs/commit/5996243e793c19a0933c8df5869b79088279343d
{
  inputs = {
    nixpkgs.url = "https://github.com/NixOS/nixpkgs/archive/5996243e793c19a0933c8df5869b79088279343d.tar.gz";
    secrets.url = "https://github.com/chris-de-leon/secrets-cli/archive/refs/tags/v1.2.2.tar.gz";
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

          shellHook = ''
            # HACK: this is just a short term solution to get lmdb working - need to find a better way to add it to the shell env:
            # https://discourse.nixos.org/t/nixos-with-poetry-installed-pandas-libstdc-so-6-cannot-open-shared-object-file/8442/9
            export LD_LIBRARY_PATH=${pkgs.lib.makeLibraryPath [
              pkgs.stdenv.cc.cc
            ]}
          '';
        };
      }
    );
}

