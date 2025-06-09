{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, utils }:
    utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        bws = import ./nix/bws { inherit pkgs; };
      in
      rec {
        formatter = pkgs.nixpkgs-fmt;

        devShells.default = pkgs.mkShell {
          # NOTE: it is much faster to install the Bitwarden secrets CLI
          # via Docker instead of Nix. Installing via Docker also allows
          # us to avoid having to use the NIXPKGS_ALLOW_UNFREE=1 env var
          # and `--impure` for Nix shells
          packages = [
            pkgs.bashInteractive
            pkgs.sqlite
            pkgs.nodejs
            pkgs.bun
            bws
          ];

          # NOTE: `bws secret list` will NOT return an empty list if the project contains no secrets. Instead it will fail with a 404 error. To fix
          # this, there needs to be at least one dummy secret added to the project. There's a thread about this linked below but it has no activity
          # https://community.bitwarden.com/t/bws-secret-list-project-id-shouldnt-return-a-404-if-there-are-no-secrets-in-the-project/64668
          shellHook = ''
            export BWS_PROJECT_ID=""
            if [[ -f ./.bws ]]; then
              BWS_PROJECT_ID="$(cat .bws)"
            else
              BWS_PROJECT_ID="$(bws project create 'chain-scan' | jq -erc '.id')"
              bws secret create 'PROJECT_ID' "$BWS_PROJECT_ID" "$BWS_PROJECT_ID"
              echo -n "$BWS_PROJECT_ID" > .bws
            fi

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

